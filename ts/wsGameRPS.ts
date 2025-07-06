enum RPSServerCode {
  ConnClose = 0,
  ConnOpen = 1,
  EnterPool = 2,
  EnterLobby = 4,
  GameInfo = 5,
  GameResult = 6,
}
enum RPSClientCode {
  ConnClose = 0,
  Registering = 1,
  Play = 2,
}

enum RPSPlayCode {
  ROCK = 0,
  PAPER = 1,
  SCISSORS = 2,
}

type PlayData = {
  id: string;
  play: RPSPlayCode;
};

type GameResultData = {
  id: string;
  play: RPSPlayCode;
};


type RPSRegisterData = {
  id: string;
  name: string;
};

type GameInfoData = {
  user: RPSRegisterData;
  opponent: RPSRegisterData;
  gameState: {
    user: RPSPlayCode | null;
    opponent: boolean;
    timer: number;
  };
};

