export type Alerts = {
    id: string;
    userId: string;
    title: string;
    rawQuery: string;
    destination: string;
    configuration: JSON;
    cronExpression: string;
    repeatCount: number;
    organisationId: string | null;
}