// progress indicator chart (created by me, not data team)

export default {
  properties: [
    {
      title:
        '% of Houses Delivered So Far out of Previous 5 Financial Years Target.',
      info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae et cupiditate eos earum.',
      name: 'Housing Delivery',
      target: 300,
      // to view no data state
      progress: undefined,
    },
    {
      title:
        '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
      info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae et cupiditate eos earum.',
      name: 'Intermediate Delivery',
      target: 4000,
      progress: 1100,
    },
    {
      title: '% Market Houses Delivered so Far Out of Current Financial Year',
      info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae et cupiditate eos earum.',
      name: 'Market Houses',
      target: 550,
      progress: 121,
    },
    {
      title: '% Social Rented Houses Delivered so Far Out of Yearly Target',
      info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae et cupiditate eos earum.',
      name: 'Social Rented',
      target: 360,
      progress: 190,
    },
  ],
};
