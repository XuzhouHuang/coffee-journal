import { EntityDialog } from "@/components/entity-dialog";
export function RegionDialog() {
  return (
    <EntityDialog
      title="添加产区"
      buttonLabel="添加产区"
      apiEndpoint="/api/regions"
      fields={[
        { name: "country", label: "国家", required: true },
        { name: "region", label: "产区", required: true },
        { name: "subRegion", label: "子产区" },
        { name: "altitude", label: "海拔" },
        { name: "climate", label: "气候" },
        { name: "notes", label: "备注", type: "textarea" },
      ]}
    />
  );
}
