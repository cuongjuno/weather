import React from 'react';
import StoryOne from './Component/Story_One/StoryOne';
const routes = [
  {
    path: '/',
    exact: true,
    main: () => <StoryOne />,
  },
  // {
  //   path: '/:let/:lon',
  //   main: (props) => <Details {...props} />,
  // },
];

export default routes;
