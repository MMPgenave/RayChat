import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>React Shadcn Starter</CardTitle>
          <CardDescription>React + Vite + TypeScript template for building apps with shadcn/ui.</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
