export interface SubModel {
  name: string;
  premium: boolean;
  id: string;
}

export interface ModelConfig {
  model: string;
  icon: string;
  premium: boolean;
  enable: boolean;
  subModel: SubModel[];
}

export type ModelConfigList = ModelConfig[];
