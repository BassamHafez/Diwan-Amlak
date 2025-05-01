import { mainFormsHandlerTypeFormData } from "../../../../util/Http";
import styles from "../../Admin.module.css";
import { Form, Formik, FontAwesomeIcon } from "../../../../shared/index";
import { faSpinner, toast } from "../../../../shared/constants";
import {
  useMutation,
  useTranslation,
  useFileHandler,
  useSelector,
} from "../../../../shared/hooks";
import { Row, Col } from "../../../../shared/bootstrap";

const UpdateAssets = () => {
  const { selectedFile, imagePreviewUrl, handleFileChange } = useFileHandler();
  const {
    selectedFile: selectedFile2,
    imagePreviewUrl: imagePreviewUrl2,
    handleFileChange: handleFileChange2,
  } = useFileHandler();

  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    banner: "",
    banner2: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    const files = [
      { key: "banner1", file: selectedFile },
      { key: "banner2", file: selectedFile2 },
    ];

    files.forEach(({ key, file }) => {
      if (file) {
        formData.append(key, file);
      }
    });

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: formData,
            token: token,
            method: "put",
            type: "configs/banners",
          },
          {
            onSuccess: (data) => {
              console.log(data);
              if (data?.status === "success") {
                resolve();
                resetForm();
              } else {
                reject();
              }
            },
            onError: (error) => {
              console.log(error);
              reject();
            },
          }
        );
      }),
      {
        pending: key(key("saving")),
        success: key("updatedSucc"),
        error: key("wrong"),
      }
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <Form>
        <Row>
          <Col md={6} className="mb-4 p-2 position-relative">
            <div className={`${styles.photo_field} h-100`}>
              <h6 className="mb-3">{key("banner")} (3:4)</h6>
              <label className={styles.photo_label_img} htmlFor="banner">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded Preview"
                    className={styles.image_preview}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_Host}/designs/banner1.webp`}
                    alt="old_image_Preview"
                    className={styles.image_preview}
                  />
                )}
              </label>
              <input
                type="file"
                id="banner"
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />
            </div>
          </Col>
          <Col md={6} className="mb-4 p-2 position-relative">
            <div className={`${styles.photo_field} h-100`}>
              <h6 className="mb-3">{key("banner2")} (16:9)</h6>
              <label className={styles.photo_label_img} htmlFor="banner2">
                {imagePreviewUrl2 ? (
                  <img
                    src={imagePreviewUrl2}
                    alt="Uploaded Preview2"
                    className={styles.image_preview}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_Host}/designs/banner2.webp`}
                    alt="old_image_Preview2"
                    className={styles.image_preview}
                  />
                )}
              </label>
              <input
                type="file"
                id="banner2"
                accept="image/*"
                onChange={handleFileChange2}
                className="d-none"
              />
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-end align-items-center mt-3">
          <button className="submit_btn my-2" type={isPending ? "button" : "submit"}>
            {isPending ? (
              <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
            ) : (
              key("update")
            )}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default UpdateAssets;
