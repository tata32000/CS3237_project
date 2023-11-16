import { useEffect, useState } from 'react';
import { Storage, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';


const RecentImage = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    PubSub.addPluggable(
        new AWSIoTProvider({
          aws_pubsub_region: 'ap-southeast-2',
          aws_pubsub_endpoint:
            'wss://a3ir1nqy23cnya-ats.iot.ap-southeast-2.amazonaws.com/mqtt'
        })
      );

    PubSub.subscribe('esp32/classifier').subscribe({
        next: (data) => {
            fetchImage();
            console.log('Message received', data);
        },
        error: (error) => console.error(error),
        complete: () => console.log('Done'),
    })

    const fetchImage = async () => {
      try {
        // Get a list of files from the specified S3 bucket
        const listResponse = await Storage.list('');

        // Extract the array of objects from the response
        console.log(listResponse)
        let imageKeys = listResponse.results;

        // Assuming filenames are like '20231115_123456_uuid.jpg'
        imageKeys = imageKeys.filter((key) => key.key?.endsWith('.jpg'));
        const sortedImages = imageKeys.sort((a, b) => {
        // Extract the timestamp part of the filename
        const extractTimestamp = (key: string) => {
            const matches = key.match(/\d{8}_\d{6}/);
            return matches ? matches[0] : '';
        };
        if (!a.key || !b.key) {
            return 0;
        }
        const timestampA = extractTimestamp(a.key);
        const timestampB = extractTimestamp(b.key);

        // Compare timestamps in descending order
        return timestampB.localeCompare(timestampA);
        });

        const recentImageKey = sortedImages[0]?.key || '';

        const url = await Storage.get(recentImageKey);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image from S3', error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="flex justify-center items-center bg-gray-100">
    {imageUrl ? (
        <img 
        src={imageUrl} 
        alt="Recent" 
        className="max-w-full h-auto rounded-lg shadow-lg"
        />
    ) : (
        <p className="text-gray-700 text-lg font-semibold">Loading...</p>
    )}
    </div>
  );
};

export default RecentImage;
