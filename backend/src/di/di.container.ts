import { Container } from "inversify";
import "reflect-metadata";

import { registerShared } from "./shared.di.container";
import { registerLearner } from "./learner.di.container";
import { registerProfessional } from "./professional.di.container";
import { registerAdmin } from "./admin.di.container";

const container = new Container();

// Order doesn't matter much, but shared first is cleaner
registerShared(container);
registerLearner(container);
registerProfessional(container);
registerAdmin(container);

export default container;
