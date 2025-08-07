// src/components/layout/MobileSidebar.jsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Sidebar from "./Sidebar"

const MobileSidebar = ({ children }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
                <Sidebar className="w-full" />
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar
