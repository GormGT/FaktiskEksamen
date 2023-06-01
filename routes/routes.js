const { Router } = require("express");
const controller = require("../controllers/controller");
const { requireAuth, requireMaxAuth, checkUser, preventEntry } = require('../middleware/loginMiddleware');

// router
const router = Router();

// routes
router.get("*", checkUser);

router.get("/", controller.home_get);

// router.get("/home/:username", requireAuth, controller.userHome_get);

router.get("/veiledning", requireMaxAuth, controller.guide_get);


// auth routes
router.get("/sign-in", controller.login_get);

router.get("/sign-up", preventEntry, controller.signup_get);

router.post("/sign-in", controller.login_post);

router.post("/sign-up", controller.signup_post);

router.get("/logout", controller.logout_get);


router.get("/admin", requireMaxAuth, controller.admin_get);


// pokoform routes
router.post("/documentCreate", requireAuth, controller.doc_post);

router.post("/loadNewest", controller.doc_load_recent);

router.post("/loadSpecific", controller.doc_load_specific);

router.post("/loadPersonal", controller.doc_load_personal);

router.post("/docUpdateFetch", controller.doc_update_fetch);

router.post("/docUpdate", controller.doc_update);

router.post("/docDelete", requireAuth, controller.doc_delete);

// legacy form routes
router.get("/form", requireAuth, controller.form_get);

router.post("/form", controller.form_post);

router.post("/thing", controller.blog_readOne);

router.post("/updat", controller.doc_legacy_update);

router.post("/delet", controller.doc_legacy_delete);

// somewhat dangerous routes
router.get("/:username", requireAuth, controller.userView_get); // Messes with 404

module.exports = router;