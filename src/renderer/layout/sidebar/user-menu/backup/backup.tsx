import { h } from "preact";
import {
  ArrowDownOnSquareStackIcon,
  ArrowUpOnSquareStackIcon,
  FolderIcon,
} from "@heroicons/react/24/solid";
import { useController } from "../../../../hooks/use-controller.hook";
import { BackupAction, BackupController, BackupProps } from "./backup.ctrl";
import SubmitCancel from "../../../../components/submit-cancel";
import { useProvider } from "@/renderer/hooks";
import { AuthStore } from "@/renderer/stores";

export default function Backup(props: BackupProps) {
  const ctrl = useController<BackupProps, BackupController>(
    BackupController,
    props
  );

  const authStore = useProvider<AuthStore>(AuthStore);

  if (!authStore.state.sessionActive.value) return;

  const inProgress = ctrl.state.backupInProgress.value;

  return (
    <dialog id="backup-modal" class="modal">
      <form {...ctrl.form.elementProps} id="backup-form" class="modal-box">
        <div class="flex items-center">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Backup folder</span>
            </label>
            <div class="flex items-center">
              <input
                class="input input-bordered w-full invalid:input-error mr-2"
                value={ctrl.form.state.backupDir.value}
                onInput={ctrl.form.handleInput}
                name="backupDir"
                required
                disabled={inProgress}
              />
              <button
                type="button"
                class="btn btn-primary"
                onClick={ctrl.selectBackupDir}
                title="Choose backup folder"
                disabled={inProgress}
              >
                <FolderIcon class="w-6 h-6 text-inherit" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-start mt-2">
          <div className="form-control mr-8">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="action"
                className="radio checked:bg-primary-500"
                value={BackupAction.Backup}
                checked={ctrl.form.state.action.value === BackupAction.Backup}
                onChange={ctrl.form.handleInput}
                disabled={inProgress}
              />
              <span className="label-text flex items-center">
                <ArrowUpOnSquareStackIcon class="w-6 h-6 text-inherit mr-2" />
                <span>Backup</span>
              </span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="action"
                className="radio checked:bg-primary-500"
                value={BackupAction.Restore}
                checked={ctrl.form.state.action.value === BackupAction.Restore}
                onChange={ctrl.form.handleInput}
                disabled={inProgress}
              />
              <span className="label-text flex items-center">
                <ArrowDownOnSquareStackIcon class="w-6 h-6 text-inherit mr-2" />
                <span>Restore</span>
              </span>
            </label>
          </div>
        </div>
        <SubmitCancel
          class="modal-action"
          onCancel={props.onClose}
          cancelLabel="Cancel"
          submitLabel={inProgress ? "..." : "Start"}
        />
      </form>
    </dialog>
  );
}
