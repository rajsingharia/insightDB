export class AlertService {
    public static makeAlert = (data: JSON | any) => {
        if(data.type == 'email') {
            // Send an email
        }
        else if(data.type === 'slack') {
            // Send a slack message
        }
        else if(data.type === 'whatsapp') {
            // Send a whatsapp message
        }
    }
}