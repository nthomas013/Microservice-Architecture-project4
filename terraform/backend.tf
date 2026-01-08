terraform {
backend "s3" {
bucket = "nevin-ecommerce-terraform-state"
key = "eks/terraform.tfstate"
region = "ap-south-1"
dynamodb_table = "terraform-locks"
encrypt = true
}
}
