import { createClient } from 'redis'



export const cacheDB = async () => {
    const client = createClient();
    client.on('error', (err) => {
        console.log('Error ' + err);
    });
    client.connect();
    client.set('foo', 'bar');
    const value = await client.get('foo');
    console.log(value);
    await client.disconnect();

}