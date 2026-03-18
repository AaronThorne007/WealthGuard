import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to WealthGuard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            This is a clean app shell for your capstone: left sidebar, top
            header, and routes for Dashboard, Transactions, and Goals.
          </p>
          <div>
            <Button
              asChild
              className="bg-indigo-600 text-white hover:bg-indigo-600/90"
            >
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
