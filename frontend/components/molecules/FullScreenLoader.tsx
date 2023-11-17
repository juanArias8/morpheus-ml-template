import CircleLoader from "@/components/atoms/CircleLoader";

type FullScreenLoaderProps = {
  isLoading: boolean;
};

const FullScreenLoader = (props: FullScreenLoaderProps) => {
  return (
    <div className={"flex items-center justify-center w-full h-screen"}>
      {props.isLoading && (
        <CircleLoader isLoading={props.isLoading} displayText={true} />
      )}
    </div>
  );
};

export default FullScreenLoader;
