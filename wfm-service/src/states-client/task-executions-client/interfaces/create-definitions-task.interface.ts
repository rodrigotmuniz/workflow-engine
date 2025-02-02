import { WorkflowDefinitionDto } from "src/definitions-client/dto/wf-definition.dto";

export interface CreateDefinitionsTaskInterface {
  definition: WorkflowDefinitionDto, 
  wfInstanceId: number
  body: Record<string, any>
}

