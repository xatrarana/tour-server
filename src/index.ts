import os from 'os';
import { app } from "./app";
import connectDB from "./db/connectDB";
const PORT = process.env.PORT || 3000;

const getLocalIpAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    if( networkInterface && networkInterface?.length > 0){
      for (const { address, family, internal } of networkInterface) {
        if (family === 'IPv4' && !internal) {
          return address;
        }
      }
    }
  }
  return 'localhost';
};

const localUrl = `http://localhost:${PORT}`;
const localIpAddress = getLocalIpAddress();
const networkUrl = `http://${localIpAddress}:${PORT}`;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`⚙️ local - ${localUrl} \n⚙️ network - ${networkUrl}`));
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
