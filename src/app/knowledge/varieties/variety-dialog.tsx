import { EntityDialog } from "@/components/entity-dialog";
export function VarietyDialog() {
  return (
    <EntityDialog
      title="添加品种"
      buttonLabel="添加品种"
      apiEndpoint="/api/varieties"
      fields={[
        { name: "name", label: "品种名", required: true },
        { name: "description", label: "描述", type: "textarea" },
        { name: "flavor", label: "风味" },
      ]}
    />
  );
}
