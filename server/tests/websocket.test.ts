const BACKEND_URL = "ws://localhost:3000";

describe("game application", () => {
  const ws1 = new WebSocket(BACKEND_URL);
  const ws2 = new WebSocket(BACKEND_URL);

  test("Message send from game1 react another player of game1", async () => {
    // make sure websocket are connected
    await Promise.all([
      new Promise<void>((resolve) => {
        ws1.onopen = () => resolve();
      }),
      new Promise<void>((resolve) => {
        ws2.onopen = () => resolve();
      }),
    ]);

    ws1.send(
      JSON.stringify({
        type: "join-game",
        game: "game1",
      })
    );

    ws2.send(
      JSON.stringify({
        type: "join-game",
        game: "game1",
      })
    );

    const messageRecieved = new Promise<void>((resolve) => {
      ws2.onmessage = ({ data }) => {
        console.log("data from on message", data);
        const parsedData = JSON.parse(data);

        expect(parsedData.type).toBe("move-piece");
        expect(parsedData.game).toBe("game1");
        expect(parsedData.move).toBe("somemove");
        resolve();
      };
    });

    ws1.send(
      JSON.stringify({
        type: "move-piece",
        game: "game1",
        move: "somemove",
      })
    );

    await messageRecieved;
  });

  afterEach(() => {
    ws1?.close();
    ws2?.close();
  });
});
