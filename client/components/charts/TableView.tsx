
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TableViewData } from "@/components/supportedChartsList/TableViewInput"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimeBarGraphProps {
    tableData: unknown[];
    tableViewData: TableViewData
}


export const TableView: React.FC<TimeBarGraphProps> = ({
    tableData,
    tableViewData }) => {

    const columns: string[] = []
    const columnsAlias: string[] = []

    tableViewData.tableView.forEach((col) => {
        if (col.isEnabled) {
            columnsAlias.push(col.alias)
            columns.push(col.column)
        }
    });

    return (
        <ScrollArea className="h-full w-full">
            <div className="p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            columnsAlias?.map((column, index) => (
                                <TableHead
                                    key={index}>
                                    {column}
                                </TableHead>
                            ))
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tableData.map((item, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <TableCell
                                        key={colIndex}>
                                        {item[column]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            </div>
        </ScrollArea>
    );
}
