import { Check, FileText, Shield, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: (accepted: boolean) => void;
  agreeTerms: boolean;
}

export function TermsAndPrivacyModal({
  isOpen,
  onClose,
  agreeTerms,
}: TermsAndPrivacyModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAcceptedTerms(agreeTerms);
      setAcceptedPrivacy(agreeTerms);
    }
  }, [isOpen, agreeTerms]);

  const canAccept = acceptedTerms && acceptedPrivacy;

  const handleAccept = () => {
    if (canAccept) {
      onClose(true);
    }
  };

  const handleClose = () => {
    onClose(acceptedTerms && acceptedPrivacy);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Termos de Uso e Política de Privacidade
          </DialogTitle>
          <DialogDescription>
            Leia e aceite nossos termos para continuar com o cadastro
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Termos de Uso
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-4 p-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                  1. Aceitação dos Termos
                </h3>
                <p className="text-muted-foreground text-sm">
                  Ao utilizar nosso sistema de controle de estoque, você
                  concorda com estes termos. Se não concordar, não deve usar o
                  serviço.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                  2. Descrição do Serviço
                </h3>
                <p className="text-muted-foreground text-sm">
                  Oferecemos uma plataforma completa para controle de estoque,
                  incluindo gestão de produtos, relatórios, backup automático e
                  integração com sistemas de vendas.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">3. Responsabilidades</h3>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Manter confidencialidade de senhas</li>
                  <li>Usar o sistema apenas para fins legítimos</li>
                  <li>Reportar uso indevido imediatamente</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">4. Limitações</h3>
                <p className="text-muted-foreground text-sm">
                  O sistema é fornecido "como está". Não garantimos
                  disponibilidade contínua e nossa responsabilidade está
                  limitada ao valor pago pelos serviços.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">5. Contato</h3>
                <p className="text-muted-foreground text-sm">
                  Dúvidas sobre os termos: legal@stockmanager.com
                </p>
              </div>

              <div className="bg-muted flex items-center space-x-2 rounded-lg p-3">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="accept-terms"
                  className="cursor-pointer text-sm font-medium"
                >
                  Li e aceito os Termos de Uso
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-4 p-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                  1. Dados que Coletamos
                </h3>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>Dados pessoais (nome, e-mail, telefone)</li>
                  <li>Dados empresariais (CNPJ, razão social)</li>
                  <li>Dados de uso do sistema (logs, produtos, transações)</li>
                  <li>Dados técnicos (IP, navegador, dispositivo)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">2. Como Usamos</h3>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Processar transações e manter registros</li>
                  <li>Garantir segurança e prevenir fraudes</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">3. Compartilhamento</h3>
                <p className="text-muted-foreground text-sm">
                  Não vendemos seus dados. Compartilhamos apenas com seu
                  consentimento, para cumprir obrigações legais ou com
                  prestadores de serviços sob acordos de confidencialidade.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">4. Segurança</h3>
                <p className="text-muted-foreground text-sm">
                  Implementamos criptografia, controle de acesso, monitoramento
                  contínuo e backups seguros para proteger seus dados.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                  5. Seus Direitos (LGPD)
                </h3>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>Acesso aos seus dados pessoais</li>
                  <li>Correção de dados incorretos</li>
                  <li>Exclusão de dados desnecessários</li>
                  <li>Portabilidade dos dados</li>
                  <li>Revogação do consentimento</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">6. Contato</h3>
                <p className="text-muted-foreground text-sm">
                  Para questões de privacidade: privacidade@stockmanager.com
                </p>
              </div>

              <div className="bg-muted flex items-center space-x-2 rounded-lg p-3">
                <input
                  type="checkbox"
                  id="accept-privacy"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="accept-privacy"
                  className="cursor-pointer text-sm font-medium"
                >
                  Li e aceito a Política de Privacidade
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!canAccept}
            className="bg-primary hover:bg-primary/90"
          >
            <Check className="mr-2 h-4 w-4" />
            Aceitar e Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
