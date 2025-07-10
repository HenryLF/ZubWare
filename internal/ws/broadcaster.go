package ws

type broadcaster struct {
	subs  map[ClientCode]map[chan ClientMessage]struct{}
	input chan ClientMessage
	reg   chan struct {
		code ClientCode
		ch   chan ClientMessage
	}
	unreg chan struct {
		code ClientCode
		ch   chan ClientMessage
	}
}

func (b *broadcaster) close() {
	select {
	case _, ok := <-b.input:
		if ok {
			close(b.input)
		}
	default:
		close(b.input)
	}

	select {
	case _, ok := <-b.unreg:
		if ok {
			close(b.unreg)
		}
	default:
		close(b.unreg)
	}

	select {
	case _, ok := <-b.reg:
		if ok {
			close(b.reg)
		}
	default:
		close(b.reg)
	}

	for _, cch := range b.subs {
		for ch := range cch {
			select {
			case _, ok := <-ch:
				if ok {
					close(ch)
				}
			default:
				close(ch)
			}
		}
	}
}
func (b *broadcaster) run() {
	defer b.close()
	for {
		select {
		case sub, ok := <-b.reg:
			if !ok {
				b.close()
				return
			}
			b.subs[sub.code][sub.ch] = struct{}{}
		case sub, ok := <-b.unreg:
			if !ok {
				b.close()
				return
			}
			delete(b.subs[sub.code], sub.ch)
		case msg, ok := <-b.input:
			if !ok {
				b.close()
				return
			}

			b.broadcast(msg)
		}
	}
}

func (b *broadcaster) broadcast(msg ClientMessage) {
	for ch := range b.subs[ClientCode(msg.Type)] {
		select {
		case _, ok := <-ch:
			if ok {
				ch <- msg
			}
		default:
			ch <- msg
		}
	}
}

func newBroadcaster() *broadcaster {
	subs := map[ClientCode]map[chan ClientMessage]struct{}{}

	for _, code := range []ClientCode{
		ClientConnClose,
		ClientListening,
		ClientMsg,
		ClientRegistering,
		ClientPlay,
		ClientQuit,
	} {

		subs[code] = map[chan ClientMessage]struct{}{}
	}

	b := broadcaster{
		subs:  subs,
		input: make(chan ClientMessage, 10),
		reg: make(chan struct {
			code ClientCode
			ch   chan ClientMessage
		}),
		unreg: make(chan struct {
			code ClientCode
			ch   chan ClientMessage
		}),
	}
	go b.run()

	return &b
}
