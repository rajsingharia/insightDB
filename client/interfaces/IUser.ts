/*
model User {
  id           String         @id @default(uuid())
  firstName    String
  lastName     String
  email        String         @unique
  password     String
  integrations Integration[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  role         Role           @default(USER)
  RefreshToken RefreshToken[]
}

model Integration {
  id          String   @id @default(uuid())
  name        String
  type        String
  credentials Json // not all db doest support json type (postgres does)
  user        User?    @relation(fields: [creatorId], references: [id])
  creatorId   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

*/

export interface IUser {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    createdAt: string,
    updatedAt: string,
    role: string,
    organisationName: string
}