export default function GridItem({ grid_name, children }) {
  return (
    <div className="task-grid">
      <h1>{grid_name}</h1>
      {children}
    </div>
  );
}
