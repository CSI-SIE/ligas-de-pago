import { FormControl } from "@angular/forms";

export interface formularioBuscador {
  palabraClave: FormControl<string | null>,
  idPerson: FormControl<number | null>
}
