import localStorage from "localStorage";
import { EventEmitter } from "events";
import Offline from "./offline";

export class Store extends EventEmitter {

  constructor(kinto, collection) {
    super();
    this.state = {projects: {}};
    this.kinto = kinto;

    // XXX Waiting for kinto offline management.
    Offline.on('up', () => { this.sync(); });
    // XXX Waiting for push notif.
    setTimeout(30000, () => { this.sync(); });
    this.sync();
  }

  onError(error) {
      console.log(error);
    this.emit("error", error);
  }

  load() {
    return this.collection.list()
      .then(res => {
        this.state.projects[this.project].items = res.data;
        this.emit("change", this.state);
      })
      .catch(this.onError.bind(this));
  }

  setAuth() {
    var auth = localStorage.getItem("Authorization");
    this.collection.api.optionHeaders.Authorization = 'Basic ' + auth;
  }

  setProject(project) {
    this.collection = this.kinto.collection("bill-" + project);
    this.project = project;
    this.state.projects[project] = {"data": {}, "items": []};
  }

  createProject(project) {
    this.setProject(project.name);
    this.state.projects[this.project].data = {
      "name": project.name,
      "people": project.people
    };
  }

  create(record) {
    return this.collection.create(record)
      .then(res => {
        this.state.projects[this.project].items.push(res.data);
        this.emit("change", this.state);
        // Do not wait for the sync before resolving.
        this.sync();
    }).catch(this.onError.bind(this));
  }

  enqueueSync() {
      if(Offline.state == "up"){
          sync();
      }
  }

  sync() {
    return this.collection.sync()
      .then((res) => {
        if (res.ok) {
          return this.load();
        }

        // If conflicts, take remote version and sync again (recursively).
        return Promise.all(res.conflicts.map(conflict => {
          return this.collection.resolve(conflict, conflict.remote);
        }))
        .then(_ => this.sync());
      })
      .catch(this.onError.bind(this));
  }
}
