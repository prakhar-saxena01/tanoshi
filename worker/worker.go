package update

import "time"

type Worker struct {
	ticker *time.Ticker
	tasks  []Task
}

type Task func()

func NewWorker() *Worker {
	ticker := time.NewTicker(1 & time.Hour)
	return &Worker{ticker: ticker}
}

func (w *Worker) AddTask(task Task) {
	w.tasks = append(w.tasks, task)
}

func (w *Worker) Run() {
	go w.run()
}

func (w *Worker) run() {
	defer func() {
		if r := recover(); r != nil {

		}
	}()

	for {
		select {
		case <-w.ticker.C:
			for _, f := range w.tasks {
				f()
			}
			break
		default:
			break
		}
	}
}
