import { createApp } from "./app";
import { env } from "./config/env";
import { bootstrapInitialAdmin } from "./lib/bootstrap";
import { iniciarGeracaoAutomatica } from "./lib/planRunner";

async function main() {
  await bootstrapInitialAdmin();

  // Planos preventivos passam a gerar a OS sozinhos ao chegar a antecedencia configurada -
  // ate aqui isso dependia de alguem lembrar de clicar, o que na pratica so acontece
  // depois de vencer. A rodada e' idempotente (uma OS por ciclo).
  //
  // A cada 6h, nao a cada hora: vencimento de plano tem granularidade de DIA, entao rodar
  // 24x por dia nao antecipa nenhuma OS - so acorda o Neon 24 vezes. Com o servico mantido
  // no ar pelo keep-alive, isso e' a diferenca entre ~60h e ~10h de computacao por mes.
  iniciarGeracaoAutomatica(360);

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`OptiProcess API rodando na porta ${env.port} (${env.nodeEnv})`);
  });
}

main().catch((error) => {
  console.error("Falha ao iniciar o servidor:", error);
  process.exit(1);
});
