import { WebSocket } from "ws";

const BACKEND_URL = "ws://localhost:3000";

jest.setTimeout(30_000);

describe("game application", () => {
  let ws1: WebSocket;
  let ws2: WebSocket;

  beforeEach(async () => {
    ws1 = new WebSocket(BACKEND_URL);
    ws2 = new WebSocket(BACKEND_URL);
  });

  it("Message send from game1 react another player of game1", async () => {
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

    await new Promise<void>((resolve) => {
      ws2.onmessage = ({ data }) => {
        const parsedData = JSON.parse(data as string);

        expect(parsedData.type).toBe("move-piece");
        expect(parsedData.game).toBe("game1");
        expect(parsedData.move).toBe("somemove");
        resolve();
      };

      ws1.send(
        JSON.stringify({
          type: "move-piece",
          game: "game1",
          move: "somemove",
        })
      );
    });
  });

  afterEach(() => {
    ws1?.close();
    ws2?.close();
  });
});
