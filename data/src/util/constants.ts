
type RequiredCredentials = {
    name: string;
    type: string;
    description: string;
    required: boolean;
}

type Integration = {
    id: number;
    type: string;
    name: string;
    icon?: string;
    requiredCredentials?: Array<RequiredCredentials>;
    group?: string;
    available: boolean;
}

export enum DataBaseType {
    POSTGRES_QL = 'POSTGRES_QL',
    MONGO_DB = 'MONGO_DB',
    MY_SQL = 'MY_SQL',
    ORACLE = 'ORACLE',
    CASSANDRA = 'CASSANDRA',
    DYNAMO_DB = 'DYNAMO_DB',
    REDIS = 'REDIS',
    KAFKA = 'KAFKA',
    REST_API = 'REST_API',
    RABBIT_MQ = 'RABBIT_MQ',
    ELASTIC_SEARCH = 'ELASTIC_SEARCH'
}

export const ListOfSupportedIntegrations: Array<Integration> = [
    {
        id: 1,
        type: DataBaseType.POSTGRES_QL.valueOf(),
        name: "Postgres QL",
        icon: "https://cdn-icons-png.flaticon.com/512/5968/5968342.png",
        group: "Database",
        available: true,
        requiredCredentials: [
            {
                name: "host",
                type: "string",
                description: "Host of the database",
                required: true
            },
            {
                name: "database",
                type: "string",
                description: "Name of the database",
                required: true
            },
            {
                name: "port",
                type: "number",
                description: "Port of the database",
                required: true
            },
            {
                name: "username",
                type: "string",
                description: "Username in the database",
                required: true
            },
            {
                name: "password",
                type: "password",
                description: "Password of the user",
                required: true
            },
            {
                name: "ssl",
                type: "string",
                description: "Enable SSL for connection",
                required: true,
            },
            {
                name: "ca",
                type: "string",
                description: "CA Certificate",
                required: true
            }
        ]
    },
    {
        id: 2,
        type: DataBaseType.MONGO_DB.valueOf(),
        name: "Mongo DB",
        icon: "https://static-00.iconduck.com/assets.00/mongodb-icon-2048x2048-cezvpn3f.png",
        group: "Database",
        available: true,
        requiredCredentials: [
            {
                name: "host",
                type: "string",
                description: "Host of the database",
                required: true
            },
            {
                name: "username",
                type: "string",
                description: "Username in the database",
                required: false
            },
            {
                name: "password",
                type: "password",
                description: "Password of the user",
                required: false
            }
        ]
    },
    {
        id: 3,
        type: DataBaseType.MY_SQL.valueOf(),
        name: "MySQL",
        icon: "https://cdn4.iconfinder.com/data/icons/logos-3/181/MySQL-512.png",
        group: "Database",
        available: false
    },
    {
        id: 5,
        type: DataBaseType.ORACLE.valueOf(),
        name: "Oracle",
        icon: "https://1.bp.blogspot.com/-olEGUVAbDOg/YS_VDSoSMFI/AAAAAAAAL5k/avUIQTjd2dkflGsbVp8wxIueT8HhMklIgCLcBGAsYHQ/s0/oracle-db.png",
        group: "Database",
        available: false
    },
    {
        id: 6,
        type: DataBaseType.CASSANDRA.valueOf(),
        name: "Cassandra",
        icon: "https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_200,h_200/https://api.charmhub.io/api/v1/media/download/charm_nwYyQPOuk1TkBzmKxWObtvzygxT4YXWh_icon_737a810ab4f3b82b805cce1190e3495ef08c4bc457f7c8b52ff1c54055638927.png",
        group: "Database",
        available: false
    },
    {
        id: 7,
        type: DataBaseType.DYNAMO_DB.valueOf(),
        name: "DynamoDB",
        icon: "https://upload.wikimedia.org/wikipedia/commons/f/fd/DynamoDB.png",
        group: "Database",
        available: false
    },
    {
        id: 8,
        type: DataBaseType.ELASTIC_SEARCH.valueOf(),
        name: "Elasticsearch",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-elasticsearch-226094.png",
        group: "Database",
        available: false
    },
    {
        id: 9,
        type: DataBaseType.REDIS.valueOf(),
        name: "Redis",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-redis-83994.png",
        group: "Database",
        available: true,
        requiredCredentials: [
            {
                name: "host",
                type: "string",
                description: "Host",
                required: true
            },
            {
                name: "port",
                type: "number",
                description: "Port of the database",
                required: true
            },
            {
                name: "user",
                type: "string",
                description: "Username in the database",
                required: false
            },
            {
                name: "password",
                type: "password",
                description: "Password of the user",
                required: false
            }
        ]
    },
    {
        id: 10,
        type: DataBaseType.KAFKA.valueOf(),
        name: "Kafka",
        icon: "https://cdn.confluent.io/wp-content/uploads/apache-kafka-icon-2021-e1638496305992.jpg",
        group: "Database",
        available: false,
    },
    {
        id: 11,
        type: DataBaseType.RABBIT_MQ.valueOf(),
        name: "RabbitMQ",
        icon: "https://static-00.iconduck.com/assets.00/rabbitmq-icon-484x512-s9lfaapn.png",
        group: "Database",
        available: false
    },
    {
        id: 12,
        type: DataBaseType.REST_API.valueOf(),
        name: "Rest Api",
        icon: "https://lordicon.com/icons/wired/flat/1330-rest-api.svg",
        group: "Other",
        available: true,
        requiredCredentials: [
            {
                name: "baseUrl",
                type: "string",
                description: "",
                required: true
            }
        ]
    }
]


// export const SupportedCharts = [
//     {
//         id: 1,
//         icon: 'https://cdn-icons-png.flaticon.com/512/404/404621.png',
//         name: 'Time Bar Chart',
//         value: 'bar'
//     },
//     {
//         id: 2,
//         icon: 'https://cdn-icons-png.flaticon.com/512/3815/3815321.png',
//         name: 'Line Chart',
//         value: 'line'
//     },
//     {
//         id: 3,
//         icon: 'https://cdn-icons-png.flaticon.com/512/3589/3589902.png',
//         name: 'Pie Chart',
//         value: 'pie'
//     },
//     {
//         id: 4,
//         icon: 'https://cdn-icons-png.flaticon.com/512/7665/7665284.png',
//         name: 'Scatter Chart',
//         value: 'scatter'
//     },
//     {
//         id: 5,
//         icon: 'https://cdn-icons-png.flaticon.com/512/425/425064.png',
//         name: 'Area Chart',
//         value: 'area'
//     },
//     {
//         id: 6,
//         icon: 'https://cdn-icons-png.flaticon.com/512/3815/3815321.png',
//         name: 'Stacked Area Chart',
//         value: 'stackedArea'
//     },
//     {
//         id: 7,
//         icon: 'https://cdn-icons-png.flaticon.com/512/3815/3815321.png',
//         name: 'Stacked Bar Chart',
//         value: 'stackedBar'
//     },
//     {
//         id: 8,
//         icon: 'https://cdn-icons-png.flaticon.com/128/7358/7358747.png',
//         name: 'Text Area',
//         value: 'text'
//     }
// ]