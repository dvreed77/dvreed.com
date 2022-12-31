export const SimpleTable = () => {
  const data = [
    { city: "Portland", state: "Oregon", count: "80" },
    { city: "Denver", state: "Colorado", count: "77" },
    { city: "San Diego", state: "California", count: "74" },
    { city: "Chicago", state: "Illinois", count: "69" },
    { city: "Seattle", state: "Washington", count: "67" },
    { city: "Austin", state: "Texas", count: "43" },
    { city: "Albuquerque", state: "New Mexico", count: "40" },
    { city: "San Francisco", state: "California", count: "37" },
    { city: "Minneapolis", state: "Minnesota", count: "36" },
    { city: "Indianapolis", state: "Indiana", count: "35" },
    { city: "Asheville", state: "North Carolina", count: "30" },
    { city: "Los Angeles", state: "California", count: "29" },
    { city: "Milwaukee", state: "Wisconsin", count: "28" },
    { city: "Brooklyn", state: "New York", count: "26" },
    { city: "Saint Louis", state: "Missouri", count: "26" },
    { city: "Cincinnati", state: "Ohio", count: "26" },
    { city: "Nashville", state: "Tennessee", count: "25" },
    { city: "Columbus", state: "Ohio", count: "25" },
    { city: "Colorado Springs", state: "Colorado", count: "25" },
  ];

  return (
    <div className="overflow-x-auto not-prose">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>City</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ city, state, count }, i) => (
            <tr key={i}>
              <th>{i + 1}</th>
              <td>
                {city}, {state}
              </td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
