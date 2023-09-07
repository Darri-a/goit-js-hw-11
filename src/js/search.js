import axios from 'axios';

export const fetchImages = (query, page) => {
  const options = {
    params: {
      key: '39311581-365295426aecb4fdb1fc938c4',
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };

  return axios.get(`https://pixabay.com/api/`, options);
};
