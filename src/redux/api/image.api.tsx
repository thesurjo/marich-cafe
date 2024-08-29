import axios from 'axios';

export const uploadImageToImgur = async (imageData:any) => {
    try {
      const response = await axios.post('https://api.imgur.com/3/image', {
        image: imageData,
      }, {
        headers: {
          Authorization: `Client-ID ${ process.env.IMGUR_CLIENT_ID} ${process.env.IMGUR_CLIENT_SECRET}`,
        },
      });
      if (response.data.success) {
        return response.data.data.link;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      throw new Error('Error uploading image to Imgur');
    }
  };