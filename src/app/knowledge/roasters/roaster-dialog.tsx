import { EntityDialog } from "@/components/entity-dialog";
export function RoasterDialog() {
  return (
    <EntityDialog
      title="添加烘焙商"
      buttonLabel="添加烘焙商"
      apiEndpoint="/api/roasters"
      fields={[
        { name: "name", label: "名称", required: true },
        { name: "country", label: "国家", required: true },
        { name: "specialty", label: "特色" },
        { name: "website", label: "网站", type: "url" },
        { name: "shopUrl", label: "店铺链接", type: "url" },
        { name: "notes", label: "备注", type: "textarea" },
      ]}
    />
  );
}
