RegisterCommand('si', async (source: number, args: any, raw: string) => {
    const serverPlayer = GetPlayerServerId(PlayerId())

    emit('chat:addMessage', {
        args: [`${serverPlayer}`]
    });
}, false);

RegisterCommand('createrace', async (source: number, args: any, raw: string) => {
    if(args.length !== 6) {
        return;
    }
  
    const terace = args[0].toString();
    const model = args[1].toString();
    const color1 = parseInt(args[2]);
    const color2 = parseInt(args[3]);
    const color3 = parseInt(args[4]);
    const maxPlayers = parseInt(args[5]);

    const hash = GetHashKey(model);

    if (!IsModelInCdimage(hash) || !IsModelAVehicle(hash)) {
        emit('chat:addMessage', {
            args: [`Такой модели нет`]
        });
        return;   
    }

    if(maxPlayers < 2) {
        emit('chat:addMessage', {
            args: [`Минимум 2`]
        });
        return;   
    }

    const serverPlayer = GetPlayerServerId(PlayerId())
    emitNet('racelobby:create', serverPlayer, terace, model, color1, color2, color3, maxPlayers);
  
}, false);