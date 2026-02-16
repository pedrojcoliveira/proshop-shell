const MonolithFrame = () => {
  return (
    <iframe
      src="http://localhost:3001"
      style={{
        width: "100%",
        minHeight: "calc(100vh - 150px)",
        border: "none",
        display: "block",
      }}
      title="ProShop Content"
    />
  );
};

export default MonolithFrame;
