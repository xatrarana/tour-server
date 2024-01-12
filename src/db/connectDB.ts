import { connect } from "mongoose";

const connectDB = async () => {
  const DBURI = `${process.env.DATABASE_URL!}/${process.env.DATABASE_NAME!}`;
  try {
    const connectionInstance = await connect(DBURI);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
