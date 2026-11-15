# learning-game-core: preserved planned game source

Source `apps/games/05-core-learning-strategy/shared/` at `4f72ea86928666189b32f6f05c2c697a37341d06`.
Mechanical baseline `516da45cc6eff3020d4004cb692e3e527bcad654` preserves all7
current file blobs and modes with owned path history. Commit maps and original
full history remain in private recovery.

This separate change declares a public package and replaces cross-repository
relative imports with the shared library's public exports. The three shared modules have one owner here. Cross-game report/save-version tests and the unchanged legacy fixture belong to the parent whole-system test suite.

This is a shared pure-domain library, not an enabled Desktop app. Rendering,
window lifecycle, audio, account storage and authorized human/agent host operations
still require implementation and real browser qualification. Existing version1
save incompatibilities remain explicit; no migration or simulated support is added.

Develop through the parent npm workspace or supply the declared shared package
from a verified local checkout. No registry publication, original-source import,
production service or historical account data is required.
