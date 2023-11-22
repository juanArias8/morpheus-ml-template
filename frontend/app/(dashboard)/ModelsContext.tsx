import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getModels } from "@/api/models-api";
import { Model } from "@/lib/models";

interface IModelsContext {
  models: Model[];
  findValidModelsForCategory: (category: string) => Array<Model>;
}

const ModelsContext = createContext<IModelsContext>({} as IModelsContext);
const ModelsProvider = (props: { children: ReactNode }) => {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    getModels().then((response) => {
      if (response.success && response.data) {
        setModels(response.data || []);
      }
    });
  }, []);

  const findValidModelsForCategory = (categoryKey: string): Model[] => {
    const categoryModels: Model[] = models.filter(
      (model: Model) => model.category.key === categoryKey,
    );
    return categoryModels || [];
  };

  return (
    <ModelsContext.Provider
      value={{
        models,
        findValidModelsForCategory,
      }}
    >
      {props.children}
    </ModelsContext.Provider>
  );
};

const useModels = () => {
  const context = useContext(ModelsContext);
  if (context === undefined) {
    throw new Error("useModels must be used within a ModelsProvider");
  }
  return context;
};

export { ModelsProvider, useModels };
