import { EntityDialog } from "@/components/entity-dialog";
export function ProcessingDialog() {
  return (
    <EntityDialog
      title="添加处理法"
      buttonLabel="添加处理法"
      apiEndpoint="/api/processing"
      fields={[
        { name: "name", label: "处理法名称", required: true },
        { name: "description", label: "详细说明", type: "textarea" },
        { name: "flavorNotes", label: "风味特点", type: "textarea" },
        { name: "suitable", label: "适合场景" },
      ]}
    />
  );
}
