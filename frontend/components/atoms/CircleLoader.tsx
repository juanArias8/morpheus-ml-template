export interface CircleLoaderProps {
  isLoading: boolean;
}

const CircleLoader = (props: CircleLoaderProps) => {
  return props.isLoading ? (
    <span className="loading loading-spinner loading-lg">
      <span className="text-5xl">Loading...</span>
    </span>
  ) : null;
};

export default CircleLoader;
