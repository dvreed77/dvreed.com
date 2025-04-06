interface Shape {
  id: number;
  coordinates: [number, number][];
}

export const demoShapes: Shape[] = [
  {
    id: 0,
    coordinates: [
      [50,50],
      [150,50],
      [150,150],
      [50,150],
      [50,50]
    ]
  },
  {
    id: 1,
    coordinates: [
      [150,50],
      [250,50],
      [250,150],
      [150,150],
      [150,50]
    ]
  },
  {
    id: 2,
    coordinates: [
      [50,150],
      [150,150],
      [250,150],
      [250,250],
      [50,250]
    ]
  }
];
