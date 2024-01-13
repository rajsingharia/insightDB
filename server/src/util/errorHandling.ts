
import Express, { NextFunction, Request, Response }  from "express";

const ErrorHandlerRouter = Express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ErrorHandlerRouter.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    const errorMessage = (err instanceof Error) ? err.message : "Something went wrong";
    console.log(err);
    res.status(500).send(errorMessage);
});

export default ErrorHandlerRouter;