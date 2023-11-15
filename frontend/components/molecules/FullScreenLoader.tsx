type FullScreenLoaderProps = {
  isLoading: boolean;
};

const FullScreenLoader = (props: FullScreenLoaderProps) => {
  return (
    <div className={"h-full w-full"}>
      {props.isLoading && (
        <span className="loading loading-spinner loading-lg">
          <span className="text-5xl">Loading...</span>
        </span>
      )}
    </div>
  );
};

export default FullScreenLoader;
