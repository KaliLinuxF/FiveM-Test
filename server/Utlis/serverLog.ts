
RegisterServerEvent('serverlog');

on('serverlog', (text: string) => {
    console.log(text);
});
