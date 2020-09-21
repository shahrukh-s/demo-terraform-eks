# demo-terraform-eks

Prerequisites: 

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://docs.docker.com/engine/install/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [AWS IAM authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html)
- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- [Helm](https://helm.sh/docs/intro/install/)

Note: set default AWS Cred region to us-west-2

Install all above softwares!


##Step 1 - Provision the infra using terraform

Clone the project

```shell
git clone https://github.com/shahrukh-s/demo-terraform-eks.git
```

```shell
cd demo-terraform-eks
```

initailize terraform 

```shell
terraform init terraform/
```
Check terraform code and dry run 

```shell
terraform plan terraform/
```

Apply changes to the AWS Account

```shell
terraform apply terraform/
```

##Step 2 - Update kube-config to system 

```shell
mkdir ~/.kube/
terraform output terraform/kubeconfig>~/.kube/config
```

```shell
terraform output terraform/config_map_aws_auth > configmap.yml
kubectl apply -f terraform/configmap.yml
```

##Step 3 - build docker image push to AWS ECR 

Create AWS ECR Repo 

```shell
aws ecr create-repository --repository-name nodejs-app
```

Authenticate to ECR registry, replace xxxx with your AWS Account number.

```shell
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin xxxx.dkr.ecr.us-west-2.amazonaws.com
```
Build Docker Image 

```shell
docker build -t nodejs-app  node-app/
```

Tag Docker Image, replace xxxx with your AWS Account number. 

```shell
docker tag nodejs-app:latest xxxx.dkr.ecr.us-west-2.amazonaws.com/nodejs-app:latest
```

Push Docker image to AWS ECR 

```shell
docker push xxxx.dkr.ecr.us-west-2.amazonaws.com/nodejs-app:latest
```

##Step 4 - Deploy metric server to the EKS Cluster

```shell
kubectl apply -f metric/metric-server.yaml
```

##Step 5 - Deploy Nodejs application to EKS Cluster using Helm Chart

Deploy app with Service AWS NLB (publicly accessible) and exposed to the 80 port. 

```shell
helm install app helm/ --set image.repository=xxxx.dkr.ecr.us-west-2.amazonaws.com/nodejs-app --set image.tag=latest
```

For see the configuration please refer helm/templates/deployment.yaml, helm/templates/service.yaml and helm/values.yaml 

##Output
![Preview](https://raw.githubusercontent.com/shahrukh-s/demo-terraform-eks/blob/master/output.png)


