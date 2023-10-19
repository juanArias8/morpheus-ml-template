export interface CircleLoaderProps {
  isLoading: boolean;
}

const CircleLoader = (props: CircleLoaderProps) => {
  return props.isLoading ? (
    <div className="flex items-center">
      <span className="loading loading-ring loading-lg text-primary" />
      <span className="ml-2 text-xl">Loading...</span>
    </div>
  ) : null;
};

export default CircleLoader;
