"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, AlertTriangle, Save, Trash2 } from "lucide-react";

export function ModalesDemo() {
  const [openMd, setOpenMd] = useState(false);
  const [openLg, setOpenLg] = useState(false);

  return (
    <div className="app-page p-6">
      <PageHeader
        title="Modales"
        lead="Ejemplos de los componentes de modal del design system"
      />

      <div className="grid gap-6 mt-6 lg:grid-cols-2">
        <div className="app-card p-5">
          <h2 className="text-base font-semibold mb-3">Modal mediano</h2>
          <p className="text-sm text-muted-foreground mb-4">
            560px de ancho. Ideal para formularios estandar de 4-8 campos.
          </p>
          <Button onClick={() => setOpenMd(true)}>Abrir modal mediano</Button>
        </div>

        <div className="app-card p-5">
          <h2 className="text-base font-semibold mb-3">Modal grande</h2>
          <p className="text-sm text-muted-foreground mb-4">
            910px de ancho. Ideal para formularios complejos con mas de 8 campos.
          </p>
          <Button onClick={() => setOpenLg(true)}>Abrir modal grande</Button>
        </div>

        <div className="app-card p-5">
          <h2 className="text-base font-semibold mb-3">Botones</h2>
          <div className="flex flex-wrap gap-3">
            <Button>
              <Save className="mr-2 size-4" />
              Guardar
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
      </div>

      <Dialog open={openMd} onOpenChange={setOpenMd}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Ejemplo de modal mediano
            </DialogTitle>
            <DialogDescription>
              Este modal usa 560px de ancho.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <p className="text-sm text-muted-foreground">
              Este es el cuerpo del modal. Aqui van los campos del formulario,
              tablas o cualquier contenido que necesite scroll.
            </p>
            <Input placeholder="Campo de ejemplo 1" />
            <Input placeholder="Campo de ejemplo 2" />
            <Input placeholder="Campo de ejemplo 3" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenMd(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpenMd(false)}>
              <Save className="mr-2 size-4" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openLg} onOpenChange={setOpenLg}>
        <DialogContent className="sm:max-w-[920px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5" />
              Ejemplo de modal grande
            </DialogTitle>
            <DialogDescription>
              Este modal usa 910px de ancho.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <p className="text-sm text-muted-foreground">
              Este modal es mas ancho y permite contenido complejo como tablas,
              arboles o formularios con muchas secciones.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="Campo 1" />
              <Input placeholder="Campo 2" />
              <Input placeholder="Campo 3" />
              <Input placeholder="Campo 4" />
              <Input placeholder="Campo 5" />
              <Input placeholder="Campo 6" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setOpenLg(false)}
            >
              <Trash2 className="mr-2 size-4" />
              Descartar
            </Button>
            <Button onClick={() => setOpenLg(false)}>
              <Save className="mr-2 size-4" />
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
