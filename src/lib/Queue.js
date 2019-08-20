import Bee from 'bee-queue'; // import para controlar processos em fila
import CancellationMail from '../app/jobs/CancellationMail'; // importa a configuração do processo sobre email de cancelamento
import redisConfig from '../config/redis'; // importa a configuração do redis (banco performatico para registrar os processos)

const jobs = [CancellationMail]; // processos para serem monitorados

class Queue {
  // inicia a fila e processos
  constructor() {
    this.queues = {};

    this.init();
  }

  // para cada job, ele recebe a key e o handle indicado
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // adiciona o job (processo) na fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // fila de processos
  // registra os erros na fila e chama uma função para tratar devidamente
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  // função para tratamento de falhas nos jobs
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
