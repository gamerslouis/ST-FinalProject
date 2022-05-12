import Client from './client'

describe('client', () => {
    let client;

    beforeEach(() => {
        client = new Client("123");
    })
  
    it('construct client', () => {
        expect(client.username).toEqual('123');
        expect(client.input.socket).toEqual(client.network.getSocket());
    })

    it('can start', async () => {
        client.start();
        //太難了
    })

    it('can be game over', () => {
        const gameOver = jest.spyOn(client, 'gameOver');
        client.gameOver();
        expect(gameOver).toHaveBeenCalled();
    })
})